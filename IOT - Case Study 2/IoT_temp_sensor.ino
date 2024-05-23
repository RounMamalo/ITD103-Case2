#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>
#include <time.h>

// WiFi credentials
const char *ssid = "Strawhat2.4G"; // Name of your existing Wi-Fi network
const char *password = "Pirateking123!"; // Password for your Wi-Fi network

// Server URL
const char *serverUrl = "http://192.168.1.23:3000/data"; // Replace with your Node.js server IP and port

// DHT sensor
DHT dht(26, DHT11);

// Variables to hold sensor data
float temperature = 0.0;
float humidity = 0.0;

// Function to get current date and time in UTC+8
String getCurrentTime() {
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    Serial.println("Failed to obtain time");
    return "N/A";
  }
  char timeString[30];
  strftime(timeString, sizeof(timeString), "%Y-%m-%dT%H:%M:%S%z", &timeinfo); 
  return String(timeString);
}

void setup(void) {
  Serial.begin(115200);
  dht.begin();

  // Connect to Wi-Fi network
  WiFi.begin(ssid, password);
  Serial.print("Connecting to ");
  Serial.print(ssid);
  Serial.println("...");

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println();
  Serial.println("WiFi connected.");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  // Initialize NTP
  configTime(8 * 3600, 0, "pool.ntp.org", "time.nist.gov"); // Set offset to 8 hours for UTC+8
  Serial.println("Waiting for time synchronization...");
  while (!time(nullptr)) {
    Serial.print(".");
    delay(1000);
  }
  Serial.println();
}

void loop(void) {
  // Read sensor data every 1 minutes
  static unsigned long previousMillis = 0;
  unsigned long currentMillis = millis();
  if (currentMillis - previousMillis >= 600000) { // 60000 ms = 1 minutes
    previousMillis = currentMillis;
    readDHTData();
    sendDataToServer();
  }
}

void readDHTData() {
  float newTemperature = dht.readTemperature();
  float newHumidity = dht.readHumidity();

  if (!isnan(newTemperature) && !isnan(newHumidity)) {
    temperature = newTemperature;
    humidity = newHumidity;
    Serial.print("Temperature: ");
    Serial.print(temperature);
    Serial.print(" °C\tHumidity: ");
    Serial.print(humidity);
    Serial.println(" %");
  } else {
    Serial.println("Failed to read from DHT sensor!");
  }
}

void sendDataToServer() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    Serial.print("Connecting to server: ");
    Serial.println(serverUrl);
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");

    String currentTime = getCurrentTime();
    String jsonData = "{\"temperature\":" + String(temperature) + ",\"humidity\":" + String(humidity) + ",\"time\":\"" + currentTime + "\"}";
    Serial.print("Sending data to server: ");
    Serial.println(jsonData);

    int httpResponseCode = http.POST(jsonData);

    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
      Serial.print("Response from server: ");
      Serial.println(response);
    } else {
      Serial.print("Error on sending POST: ");
      Serial.println(httpResponseCode);
    }

    http.end();
  } else {
    Serial.println("WiFi not connected");
  }
}
