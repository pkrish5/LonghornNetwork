import java.util.concurrent.Semaphore;
/**
 * Runnable task that simulates a chat message between two students.
 * <p>
 * Like {@link FriendRequestThread}, this class uses a static {@link Semaphore}
 * to serialize access to shared chat history structures so that multiple chat
 * threads do not corrupt the data.
 */
public class ChatThread implements Runnable {
    private UniversityStudent sender;
    private UniversityStudent receiver;
    private String message;

    // Static semaphore to ensure thread-safe chat operations.
    private static final Semaphore semaphore = new Semaphore(1);

    /**
     * Creates a new chat task representing a single message from {@code sender}
     * to {@code receiver}.
     *
     * @param sender   the student sending the message
     * @param receiver the recipient of the message
     * @param message  the contents of the chat message
     */
    public ChatThread(UniversityStudent sender, UniversityStudent receiver, String message) {
        this.sender = sender;
        this.receiver = receiver;
        this.message = message;
    }
    /**
     * Executes the chat operation in a thread-safe way.
     * <p>
     * When run, this method:
     * <ol>
     *   <li>Acquires the semaphore</li>
     *   <li>Appends the message to both students' chat histories</li>
     *   <li>Prints a log message to the console</li>
     *   <li>Releases the semaphore</li>
     * </ol>
     */
    @Override
    public void run() {
        try {
            semaphore.acquire();
            // Update chat history for both sender and receiver
            sender.addChatMessage(receiver, message);
            receiver.addChatMessage(sender, message);
            System.out.println("Chat (Thread-Safe): " + sender.name
                    + " to " + receiver.name + ": " + message);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            System.err.println("Chat interrupted: " + e.getMessage());
        } finally {
            semaphore.release();
        }
    }
}
