import java.util.concurrent.Semaphore;

public class FriendRequestThread implements Runnable {
    private UniversityStudent sender;
    private UniversityStudent receiver;

    // Static semaphore to ensure thread-safe friend request operations.
    private static final Semaphore semaphore = new Semaphore(1);

    public FriendRequestThread(UniversityStudent sender, UniversityStudent receiver) {
        this.sender = sender;
        this.receiver = receiver;
    }

    @Override
    public void run() {
        try {
            semaphore.acquire();
            // Simulate sending a friend request. In a full implementation, you would update shared data.
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
