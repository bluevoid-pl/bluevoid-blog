# Mysql workbench instalacja

Ten przewodnik poprowadzi cię w szybkiej instalacji MySQL server, MySQL router, MySQL workbench, MySQL Shell oraz konfigurację tych komponentów jako środowiska programistycznego.

1.  Pobierz instalator z oficjalnej strony:
    1.  Wejdź na [https://dev.mysql.com/downloads/installer/](https://dev.mysql.com/downloads/installer/) 
    2.  Wybierz instalator offline (mysql-installer-community-x.x.x.x.msi)[![](https://bluevoid.pl/wp-content/uploads/2025/02/mysqlinstalle.png)](https://bluevoid.pl/wp-content/uploads/2025/02/mysqlinstalle.png)
    3.  Wybierz opcję bez logowania (**No thanks, just start my download.**)[![](https://bluevoid.pl/wp-content/uploads/2025/02/mysql_installer2.png)](https://bluevoid.pl/wp-content/uploads/2025/02/mysql_installer2.png)
2.  Instalacja komponentów
    1.  Wybierz opcję **full** i kliknij **Next >** [![](https://bluevoid.pl/wp-content/uploads/2025/02/mysql_installer3-1.png)](https://bluevoid.pl/wp-content/uploads/2025/02/mysql_installer3-1.png)
    2.  Kliknij przycisk **Execute**, aby zainstalować komponenty MySQL. [![](https://bluevoid.pl/wp-content/uploads/2025/02/mysql_installer5.png)](https://bluevoid.pl/wp-content/uploads/2025/02/mysql_installer5.png)
    3.  Po zakończeniu instalacji komponentów kliknij przycisk **Next >** [![](https://bluevoid.pl/wp-content/uploads/2025/02/mysql_installer6.png)](https://bluevoid.pl/wp-content/uploads/2025/02/mysql_installer6.png)
3.  Konfiguracja komponentów
    1.  Aby rozpocząć konfigurację komponentu **MySQL server** kliknij przycisk **Next >** [![](https://bluevoid.pl/wp-content/uploads/2025/02/mysql_installer7.png)](https://bluevoid.pl/wp-content/uploads/2025/02/mysql_installer7.png)
    2.  W kroku "Type and Networking" nic nie zmieniaj i kliknij **Next >**
    3.  W kroku "Authentication method" nic nie zmieniaj i kliknij **Next >**
    4.  W kroku "Accounts and Roles" ustaw hasło do bazy danych dla użytkownika root i kliknij **Next >**
    5.  W kroku "Windows Service" nic nie zmieniaj i kliknij **Next >**
    6.  W kroku "Server File Permissions" nic nie zmieniaj i kliknij **Next >**
    7.  W kroku "Apply Configuration" kliknij **Execute**[![](https://bluevoid.pl/wp-content/uploads/2025/02/mysql_installer8.png)](https://bluevoid.pl/wp-content/uploads/2025/02/mysql_installer8.png)
    8.  Kliknij **Finish** aby zakończyć konfigurację komponentu MySQL server
    9.  Aby rozpocząć konfigurację komponentu **MySQL router** kliknij przycisk **Next >**[![](https://bluevoid.pl/wp-content/uploads/2025/02/mysql_installer9.png)](https://bluevoid.pl/wp-content/uploads/2025/02/mysql_installer9.png)
    10.  Nic nie zmieniaj i kliknij **Finish**
    11.  Aby rozpocząć konfigurację **produktu** kliknij przycisk **Next >**
    12.  W kroku "Connect to Server" wpisz hasło które wcześniej ustawiłeś do pola _password,_ po czy kliknij przycisk **Check**, jeśli podano poprawne hasło to wyświetli się wiadomość Connection succeeded. Następnie kliknij przycisk **Next >** [![](https://bluevoid.pl/wp-content/uploads/2025/02/mysql_installer10.png)](https://bluevoid.pl/wp-content/uploads/2025/02/mysql_installer10.png)
    13.  W kroku "Apply Configuration" kliknij **Execute**, a po zakończeniu konfiguracji kliknij przycisk **Finish**
    14.  Następnie kliknij przycisk **Next >**
    15.  W kroku "Installation Complete" odznacz pole _Start MySQL Shell after setup_, po czym kliknij przycisk **Finish** [![](https://bluevoid.pl/wp-content/uploads/2025/02/mysql_installer11.png)](https://bluevoid.pl/wp-content/uploads/2025/02/mysql_installer11.png)
4.  Gratulacje udało ci się zainstalować MySQL