async function testLive() {
  console.log("Testing live site: https://www.growkub.com");
  
  try {
    // 1. Check health
    const loginRes = await fetch("https://www.growkub.com/api/admin/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@growkub.com",
        password: "admin_growkub_2026",
      }),
    });
    console.log("Live Login Status:", loginRes.status);
    const loginData = await loginRes.json();
    console.log("Live Login Response:", loginData);
    const cookie = loginRes.headers.get("set-cookie");

    // 2. Health check
    const healthRes = await fetch("https://www.growkub.com/api/admin/health", {
      headers: { Cookie: cookie || "" },
    });
    console.log("Live Health Status:", healthRes.status);
    const healthData = await healthRes.json();
    console.log("Live Health Response:", JSON.stringify(healthData, null, 2));

    // 3. Try to save a setting
    const saveRes = await fetch("https://www.growkub.com/api/admin/settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie || "",
      },
      body: JSON.stringify({
        key: "hero_tagline",
        value_th: "ทดสอบบันทึกระบบสด",
        value_en: "Live Setting Test",
      }),
    });
    console.log("Live Settings Save Status:", saveRes.status);
    const saveData = await saveRes.json();
    console.log("Live Settings Save Response:", saveData);

    // 4. Try to save/create a project
    const projRes = await fetch("https://www.growkub.com/api/admin/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie || "",
      },
      body: JSON.stringify({
        title_th: "ทดสอบสด",
        title_en: "Live Test Project",
        category: "Web Application",
        short_description_th: "คำอธิบาย",
        short_description_en: "Description",
        description_th: "รายละเอียด",
        description_en: "Details",
      }),
    });
    console.log("Live Project Create Status:", projRes.status);
    const projData = await projRes.json();
    console.log("Live Project Create Response:", projData);

  } catch (err) {
    console.error("Test Live Failed:", err.message);
  }
}

testLive();
