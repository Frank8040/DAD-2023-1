import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.net.URL;
import java.util.stream.Stream;

public class Main {
    public static void main(String[] args) throws IOException {

        List<String> rutaUrls = new ArrayList<>();
        rutaUrls.add("https://upeu.edu.pe/");
        rutaUrls.add("https://upeu.edu.pe/fce/");
        rutaUrls.add("https://upeu.edu.pe/facihed/");
        rutaUrls.add("https://upeu.edu.pe/fsalud/");
        rutaUrls.add("https://upeu.edu.pe/fia/");
        rutaUrls.add("https://upeu.edu.pe/fsalud/enfermeria/");
        rutaUrls.add("https://upeu.edu.pe/fsalud/nutricion-humana/");
        rutaUrls.add("https://upeu.edu.pe/fce/administracion/");
        long tiempoInicio = System.nanoTime();
        rutaUrls.stream().forEach(s -> System.out.println(obtenerContenidodePágina(s)));
        long tiempoFin = System.nanoTime();
        System.out.println();
        System.out.print("Diferencia de tiempo sin programación paralela: "+(tiempoFin-tiempoInicio)/1_000_000_000);

        tiempoInicio = System.nanoTime();
        rutaUrls.stream().parallel().forEach(s -> obtenerContenidodePágina(s));
        tiempoFin = System.nanoTime();
        System.out.println();
        System.out.print("Diferencia de tiempo con programación paralela: "+(tiempoFin-tiempoInicio)/1_000_000_000);

    }
    private static String obtenerContenidodePágina(String rutaUrl) {
        try {
            URL url = new URL(rutaUrl);
            HttpURLConnection httpURLConnection = (HttpURLConnection) url.openConnection();
            InputStream inputStream = httpURLConnection.getInputStream();
            Stream<String> lineas = new BufferedReader(new InputStreamReader(inputStream)).lines();
            return lineas.collect(Collectors.joining());
        } catch (IOException ioException) {
            System.out.println(ioException.getMessage());
        }
        return "";
    }
}