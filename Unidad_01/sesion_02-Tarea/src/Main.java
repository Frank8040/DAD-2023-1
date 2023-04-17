import java.util.ArrayList;
import java.util.List;

public class Main {

    public static void main(String[] args) {
        List<Vehiculo> vehiculos = new ArrayList<>();
        vehiculos.add(new Vehiculo("Toyota", "Corolla", 20000));
        vehiculos.add(new Vehiculo("Honda", "Civic", 22000));
        vehiculos.add(new Vehiculo("Mazda", "3M", 18000));
        vehiculos.add(new Vehiculo("Chevrolet", "Camaro", 40000));
        vehiculos.add(new Vehiculo("Ford", "Mustang", 38000));
        vehiculos.add(new Vehiculo("Toyota", "RAV4", 40000));

        long initialTime = System.nanoTime();
        System.out.println("Lista de vehiculos: ");
        vehiculos.forEach(System.out::println);
        double suma = vehiculos.stream().mapToDouble(Vehiculo::getPrecio).sum();
        //double suma = vehiculos.stream().peek(System.out::println).mapToDouble(Vehiculo::getPrecio).sum();
        System.out.println("Suma Total (secuencial): " + suma);
        long endTime = System.nanoTime();
        System.out.println("La diferencia de tiempo de programación secuencial: "
                + (endTime - initialTime) / 1_000_000_000.0 + " segundos");

        System.out.println("============================================================");

        initialTime = System.nanoTime();
        System.out.println("Lista de vehiculos: ");
        vehiculos.stream().parallel().forEach(System.out::println);
        double sumaParalela = vehiculos.stream().parallel().mapToDouble(Vehiculo::getPrecio).sum();
        //double sumaParalela = vehiculos.stream().parallel().peek(System.out::println).mapToDouble(Vehiculo::getPrecio).sum();
        System.out.println("Suma Total (paralela): " + sumaParalela);
        endTime = System.nanoTime();
        System.out.println("La diferencia de tiempo de programación paralelo: "
                + (endTime - initialTime) / 1_000_000_000.0 + " segundos");
    }
}