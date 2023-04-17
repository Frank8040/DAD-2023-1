public class Main extends Thread {
    private int id;

    public Main(int id){
        this.id = id;
    }
    public void run(){
        System.out.println("Soy el hilo "+id);
    }
    public static void main(String[] args) {
        Main h1 = new Main(1);
        Main h2 = new Main(2);
        Main h3 = new Main(3);
        Main h4=new Main(4);
        Main h5 =new Main(5);
        h1.start();
        h2.start();
        h3.start();
        h4.start();
        h5.start();
        System.out.println("Soy el hilo principal");
    }
}