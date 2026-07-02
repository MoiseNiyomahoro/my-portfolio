var Store = (function () {
  var STORAGE_KEY = "portfolio_data";

  var defaults = {
    projects: [
      {
        id: "handwash",
        title: "Automatic Hand Wash Dispenser",
        description: "Touchless and hygienic dispenser automation with sensor-based activation.",
        fullDescription: "The dispenser uses an ultrasonic or infrared sensor to detect a hand near the nozzle and trigger a controlled motor or pump action. The system is designed to be simple, low-power, and suitable for educational and small-scale deployment.",
        tags: ["automation", "sensor"],
        technologies: ["Arduino", "Infrared Sensor", "Servo/Motor Driver", "Embedded C++"],
        components: ["Microcontroller board", "Proximity sensor", "Pump or actuator", "Power supply and switching circuit"],
        challenges: "Sensor calibration, water flow control, and reliable power supply design were the main obstacles in the prototype phase.",
        futureImprovements: "Additional enhancements could include IoT notifications, battery backup, and a more compact enclosure with a user-friendly interface.",
        codeSample: "if (sensor.detected()) {\n  activatePump();\n  delay(1500);\n  stopPump();\n}",
        image: "project-handwash.svg",
        repo: "https://github.com/MoiseNiyomahoro/Automatic-Hand-Wash-Dispenser"
      },
      {
        id: "motion",
        title: "Motion Detector System",
        description: "A smart security module that detects movement and triggers an alert workflow.",
        fullDescription: "The system uses a passive infrared sensor to detect movement and then activates a buzzer, LED, or network notification. It is useful for security monitoring and automation scenarios.",
        tags: ["sensor", "security"],
        technologies: ["Arduino", "PIR Sensor", "LED/Buzzer", "Python"],
        components: ["PIR motion sensor", "Microcontroller", "Alert output module", "Optional serial logging"],
        challenges: "Environmental noise, sensor placement, and sensitivity tuning required iterative adjustments to make the detection practical.",
        futureImprovements: "Future versions could add wireless messaging, remote monitoring, and integration with a central security dashboard.",
        codeSample: "if (digitalRead(PIR_PIN) == HIGH) {\n  triggerAlert();\n  logEvent();\n}",
        image: "project-motion.svg",
        repo: "https://github.com/MoiseNiyomahoro/Motion-Detector-System"
      },
      {
        id: "lighting",
        title: "Lighting System with Photoresistor",
        description: "An adaptive lighting solution that responds to ambient light conditions.",
        fullDescription: "The lighting system adjusts the brightness or activation of LEDs based on ambient conditions. It is a practical example of sensor-driven automation for smart environments.",
        tags: ["automation", "sensor"],
        technologies: ["Arduino", "Photoresistor", "LED Control", "Embedded C++"],
        components: ["Photoresistor sensor", "Microcontroller board", "LEDs or lamp driver", "Resistor network"],
        challenges: "Accuracy in low-light conditions and avoiding flicker at threshold transitions were the main development challenges.",
        futureImprovements: "Future iterations might support dimming profiles, daylight scheduling, and app-based control.",
        codeSample: "int light = analogRead(LDR_PIN);\nif (light < 400) {\n  digitalWrite(LED_PIN, HIGH);\n}",
        image: "project-lighting.svg",
        repo: "https://github.com/MoiseNiyomahoro/Lighting-System-Photoresistor"
      },
      {
        id: "parking",
        title: "Parking System Automation",
        description: "Automated vehicle detection and entry management for modern parking facilities.",
        fullDescription: "The parking system uses vehicle detection to identify occupancy status and triggers an automated gate or indicator. It demonstrates how simple sensors can support modern access management workflows.",
        tags: ["automation", "sensor"],
        technologies: ["Arduino", "Ultrasonic Sensor", "Servo Motor", "Automation Logic"],
        components: ["Ultrasonic distance sensor", "Microcontroller", "Gate or barrier actuator", "Status indicator"],
        challenges: "Reliable detection under varying conditions and stable barrier control were the principal engineering challenges.",
        futureImprovements: "Future enhancements could include occupancy tracking, LED indicators, remote access control, and more advanced analytics.",
        codeSample: "if (distance < threshold) {\n  openBarrier();\n} else {\n  closeBarrier();\n}",
        image: "project-parking.svg",
        repo: "https://github.com/MoiseNiyomahoro/Parking-System-Automation"
      }
    ],
    messages: []
  };

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var data = JSON.parse(raw);
        data.projects = data.projects || [];
        data.messages = data.messages || [];
        return data;
      }
    } catch (e) {}
    return null;
  }

  function save(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function getAll() {
    var data = load();
    if (!data) {
      save(defaults);
      return JSON.parse(JSON.stringify(defaults));
    }
    return data;
  }

  // --- Projects ---
  function getProjects() {
    return getAll().projects;
  }

  function getProject(id) {
    return getProjects().find(function (p) { return p.id === id; }) || null;
  }

  function addProject(project) {
    var data = getAll();
    project.id = project.id || "proj-" + Date.now();
    project.createdAt = new Date().toISOString();
    project.updatedAt = project.createdAt;
    data.projects.push(project);
    save(data);
    return project;
  }

  function updateProject(id, updates) {
    var data = getAll();
    for (var i = 0; i < data.projects.length; i++) {
      if (data.projects[i].id === id) {
        for (var key in updates) {
          if (key !== "id" && key !== "createdAt") {
            data.projects[i][key] = updates[key];
          }
        }
        data.projects[i].updatedAt = new Date().toISOString();
        save(data);
        return data.projects[i];
      }
    }
    return null;
  }

  function deleteProject(id) {
    var data = getAll();
    var idx = -1;
    for (var i = 0; i < data.projects.length; i++) {
      if (data.projects[i].id === id) { idx = i; break; }
    }
    if (idx === -1) return false;
    data.projects.splice(idx, 1);
    save(data);
    return true;
  }

  // --- Messages ---
  function getMessages() {
    return getAll().messages;
  }

  function addMessage(msg) {
    var data = getAll();
    msg.id = "msg-" + Date.now();
    msg.date = new Date().toISOString();
    msg.read = false;
    data.messages.unshift(msg);
    save(data);
    return msg;
  }

  function markMessageRead(id) {
    var data = getAll();
    for (var i = 0; i < data.messages.length; i++) {
      if (data.messages[i].id === id) {
        data.messages[i].read = true;
        save(data);
        return true;
      }
    }
    return false;
  }

  function deleteMessage(id) {
    var data = getAll();
    var idx = -1;
    for (var i = 0; i < data.messages.length; i++) {
      if (data.messages[i].id === id) { idx = i; break; }
    }
    if (idx === -1) return false;
    data.messages.splice(idx, 1);
    save(data);
    return true;
  }

  // --- Export / Import ---
  function exportData() {
    return JSON.stringify(getAll(), null, 2);
  }

  function importData(json) {
    try {
      var data = JSON.parse(json);
      if (!data.projects || !Array.isArray(data.projects)) return false;
      data.messages = data.messages || [];
      save(data);
      return true;
    } catch (e) {
      return false;
    }
  }

  function resetData() {
    save(defaults);
  }

  return {
    getProjects: getProjects,
    getProject: getProject,
    addProject: addProject,
    updateProject: updateProject,
    deleteProject: deleteProject,
    getMessages: getMessages,
    addMessage: addMessage,
    markMessageRead: markMessageRead,
    deleteMessage: deleteMessage,
    exportData: exportData,
    importData: importData,
    resetData: resetData
  };
})();
