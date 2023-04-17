import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;

public class Servidor {
    public static void main(String[] args) throws IOException {
        final int puerto = 5000;
        ServerSocket serverSocket = new ServerSocket(puerto);
        System.out.println("Servidor iniciado");
        while (true) {
            Socket socket = serverSocket.accept();
            System.out.println("Cliente conectado");
            DataInputStream dataInputStream = new DataInputStream(socket.getInputStream());
            DataOutputStream dataOutputStream = new DataOutputStream(socket.getOutputStream());
            dataOutputStream.writeUTF("Respuesta desde el servidor");
            System.out.println(" Mensaje desde el cliente "+dataInputStream.readUTF());
            socket.close();
            System.out.println("Cliente desconectado");
        }
    }
}