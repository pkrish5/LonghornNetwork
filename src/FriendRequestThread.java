import java.util.concurrent.Semaphore;
/**
 * Runnable task that simulates sending a friend request between two students.
 * <p>
 * The class uses a static {@link Semaphore} to ensure that friend-request
 * operations on shared data structures (e.g., friend lists) are performed
 * in a thread-safe manner.
 */
public class FriendRequestThread implements Runnable {
    private UniversityStudent sender;
    private UniversityStudent receiver;

    // Static semaphore to ensure thread-safe friend request operations.
    private static final Semaphore semaphore = new Semaphore(1);

    /**
     * Creates a new friend request task from {@code sender} to {@code receiver}.
     *
     * @param sender   the student initiating the friend request
     * @param receiver the student receiving the friend request
     */
    public FriendRequestThread(UniversityStudent sender, UniversityStudent receiver) {
        this.sender = sender;
        this.receiver = receiver;
    }

    /**
     * Executes the friend request in a thread-safe way.
     * <p>
     * When run, this method:
     * <ol>
     *   <li>Acquires the semaphore</li>
     *   <li>Updates both students' friend lists</li>
     *   <li>Prints a log message to the console</li>
     *   <li>Releases the semaphore</li>
     * </ol>
     */
    @Override
    public void run() {
        try {
            semaphore.acquire();
            // Add friend relationship (bidirectional)
            sender.addFriend(receiver);
            receiver.addFriend(sender);
            System.out.println("FriendRequest (Thread-Safe): " + sender.name
                    + " sent a friend request to " + receiver.name);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            System.err.println("FriendRequest interrupted: " + e.getMessage());
        } finally {
            semaphore.release();
        }
    }
}
