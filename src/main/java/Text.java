import java.sql.Connection;
import java.sql.DriverManager;

public class Text {
    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost:3306/safardrop_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
        String user = "root";
        String password = "Yash@0805";

        try (Connection conn = DriverManager.getConnection(url, user, password)) {
            if (conn != null) {
                System.out.println("✅ Connection successful!");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}