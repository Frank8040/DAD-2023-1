import java.util.ArrayList;
import java.util.List;
public class Main {
    public static void main(String[] args) {
        List<String> ciudades = new ArrayList<>();
        ciudades.add("Quillabamba");
        ciudades.add("Loreto");
        ciudades.add("Cuzco");
        for (int i = 0; i < ciudades.size(); i++) {
            System.out.println(ciudades.get(i));
        }
        System.out.println();
        for (String ciudad : ciudades) {
            System.out.println(ciudad);
        }
        System.out.println();
        ciudades.stream().forEach(s -> System.out.println(s));
        System.out.println();
        ciudades.stream().parallel().forEach(s -> System.out.println(s));
        System.out.println("Hello world");
    }
}