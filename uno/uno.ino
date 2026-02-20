#include <EEPROM.h>

String coreStatus = "";
String powerStatus = "";
String gpioStatus = "";
String wifiStatus = "";
String adcStatus = "";

int testCount = 0;

void setup() {
  Serial.begin(115200);
  Serial1.begin(9600);
  delay(1000);

  EEPROM.get(0, testCount);
  Serial.println("\n[Dock] System Ready");
}

void loop() {

  // Listen for commands from PC (Web Serial)
  if (Serial.available()) {
    String cmd = Serial.readStringUntil('\n');
    cmd.trim();
    if (cmd == "RUN_TEST") {
      Serial1.println("RUN_TEST");
      Serial.println("[Dock] Test triggered from PC");
    }
  }

  if (Serial1.available()) {
    String line = Serial1.readStringUntil('\n');
    line.trim();

    if (line == "START_REPORT") {
      resetStatuses();
      Serial.println("\n[Dock] Report Received...");
    }

    else if (line.startsWith("CORE:"))
      coreStatus = line.substring(5);

    else if (line.startsWith("POWER:"))
      powerStatus = line.substring(6);

    else if (line.startsWith("GPIO:"))
      gpioStatus = line.substring(5);

    else if (line.startsWith("WIFI:"))
      wifiStatus = line.substring(5);

    else if (line.startsWith("ADC:"))
      adcStatus = line.substring(4);

    else if (line == "END_REPORT")
      generateFinalReport();
  }
}

void resetStatuses() {
  coreStatus = "";
  powerStatus = "";
  gpioStatus = "";
  wifiStatus = "";
  adcStatus = "";
}

void generateFinalReport() {

  testCount++;
  EEPROM.put(0, testCount);

  Serial.println("\n[Dock] Starting Diagnostic Analysis...");
  delay(700);

  Serial.println("[Dock] Checking Core...");
  delay(500);
  Serial.println("Core: " + coreStatus);

  Serial.println("[Dock] Checking Power...");
  delay(500);
  Serial.println("Power Stage: " + powerStatus);

  Serial.println("[Dock] Testing GPIO...");
  delay(500);
  Serial.println("GPIO: " + gpioStatus);

  Serial.println("[Dock] Testing WiFi...");
  delay(500);
  Serial.println("WiFi: " + wifiStatus);

  Serial.println("[Dock] Testing ADC...");
  delay(500);
  Serial.println("ADC: " + adcStatus);

  int healthScore = 0;

  if (coreStatus == "PASS") healthScore += 30;
  if (gpioStatus == "PASS") healthScore += 20;
  if (wifiStatus == "PASS") healthScore += 20;
  if (adcStatus == "PASS") healthScore += 15;
  if (powerStatus == "USB_MODE") healthScore += 15;

  delay(700);
  Serial.println("\n[Dock] Computing Health Index...");
  delay(700);

  Serial.print("Health Score: ");
  Serial.print(healthScore);
  Serial.println("%");

  String grade;
  String suggestion;

  if (healthScore >= 85) {
    grade = "GRADE A - Fully Reusable";
    suggestion = "Full IoT Deployment";
  }
  else if (healthScore >= 60) {
    grade = "GRADE B - Limited Functional";
    suggestion = "Selective Deployment";
  }
  else {
    grade = "GRADE C - Restricted";
    suggestion = "Minimal Utility Use";
  }

  Serial.println("\n===== FINAL CLASSIFICATION =====");
  Serial.println("Board ID: NODE-" + String(testCount));
  Serial.println("Operational Grade: " + grade);
  Serial.println("Recommended Use: " + suggestion);
  Serial.println("Diagnostics Performed: " + String(testCount));
  Serial.println("=================================\n");

  // Machine-readable JSON for Web Serial parsing
  Serial.println("JSON_START");
  Serial.println("{");
  Serial.println("\"core\":\"" + coreStatus + "\",");
  Serial.println("\"power\":\"" + powerStatus + "\",");
  Serial.println("\"gpio\":\"" + gpioStatus + "\",");
  Serial.println("\"wifi\":\"" + wifiStatus + "\",");
  Serial.println("\"adc\":\"" + adcStatus + "\",");
  Serial.println("\"healthScore\":" + String(healthScore) + ",");
  Serial.println("\"grade\":\"" + grade + "\",");
  Serial.println("\"suggestion\":\"" + suggestion + "\",");
  Serial.println("\"boardId\":\"NODE-" + String(testCount) + "\"");
  Serial.println("}");
  Serial.println("JSON_END");
}
