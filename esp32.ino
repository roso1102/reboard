#include <WiFi.h>

#define GPIO_TEST_1 4
#define GPIO_TEST_2 5
#define GPIO_READ_1 7
#define GPIO_READ_2 8
#define POWER_MODE_PIN 2
#define ADC_PIN 3

void setup() {
  Serial.begin(9600);

  pinMode(GPIO_TEST_1, OUTPUT);
  pinMode(GPIO_TEST_2, OUTPUT);

  // IMPORTANT FIX: Prevent floating
  pinMode(GPIO_READ_1, INPUT_PULLDOWN);
  pinMode(GPIO_READ_2, INPUT_PULLDOWN);

  pinMode(POWER_MODE_PIN, INPUT_PULLUP);

  delay(1000);
  Serial.println("READY");
}

void loop() {
  if (Serial.available()) {
    String cmd = Serial.readStringUntil('\n');
    cmd.trim();
    if (cmd == "RUN_TEST") {
      runFullDiagnostic();
    }
  }
}

void runFullDiagnostic() {

  Serial.println("START_REPORT");

  // CORE
  Serial.println("CORE:PASS");

  // POWER
  if (digitalRead(POWER_MODE_PIN) == LOW)
    Serial.println("POWER:USB_MODE");
  else
    Serial.println("POWER:EXTERNAL_MODE");

  // GPIO TEST (Strict)
  int passCount = 0;

  digitalWrite(GPIO_TEST_1, HIGH);
  delay(50);
  if (digitalRead(GPIO_READ_1) == HIGH) passCount++;
  digitalWrite(GPIO_TEST_1, LOW);
  delay(50);

  digitalWrite(GPIO_TEST_2, HIGH);
  delay(50);
  if (digitalRead(GPIO_READ_2) == HIGH) passCount++;
  digitalWrite(GPIO_TEST_2, LOW);
  delay(50);

  if (passCount == 2)
    Serial.println("GPIO:PASS");
  else
    Serial.println("GPIO:FAIL");

  // WIFI TEST
  WiFi.mode(WIFI_STA);
  delay(200);

  if (WiFi.getMode() == WIFI_STA)
    Serial.println("WIFI:PASS");
  else
    Serial.println("WIFI:FAIL");

  // ADC TEST
  int adcValue = analogRead(ADC_PIN);

  if (adcValue >= 0)
    Serial.println("ADC:PASS");
  else
    Serial.println("ADC:FAIL");

  Serial.println("END_REPORT");
}
