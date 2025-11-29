import java.util.concurrent.Semaphore;

public class ChatThread implements Runnable {
    private UniversityStudent sender;
    private UniversityStudent receiver;
    private String message;

    // Static semaphore to ensure thread-safe chat operations.
    private static final Semaphore semaphore = new Semaphore(1);

    public ChatThread(UniversityStudent sender, UniversityStudent receiver, String message) {
        this.sender = sender;
        this.receiver = receiver;
        this.message = message;
    }

    @Override
    public void run() {
        try {
            semaphore.acquire();
            // Simulate sending a chat message. A real implementation would update a shared chat history.
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
