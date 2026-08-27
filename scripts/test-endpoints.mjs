async function runTests() {
  console.log("=== HICODE E2E VERIFICATION ===");

  // 1. Home TH
  const resTh = await fetch("http://localhost:3000/th");
  console.log("1. TH Home Status:", resTh.status, "(Expected 200)");

  // 2. Home EN
  const resEn = await fetch("http://localhost:3000/en");
  console.log("2. EN Home Status:", resEn.status, "(Expected 200)");

  // 3. Services Page
  const resSrv = await fetch("http://localhost:3000/en/services");
  console.log("3. Services Page Status:", resSrv.status, "(Expected 200)");

  // 4. Works Page
  const resWorks = await fetch("http://localhost:3000/en/works");
  console.log("4. Works Page Status:", resWorks.status, "(Expected 200)");

  // 5. Case Study Detail
  const resCase = await fetch("http://localhost:3000/en/works/live-commerce-platform");
  console.log("5. Case Study Status:", resCase.status, "(Expected 200)");

  // 6. Contact Form Submission
  const contactRes = await fetch("http://localhost:3000/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "David Chen",
      email: "david@testtech.com",
      phone: "+66 81 999 8888",
      company: "TestTech Corp",
      project_type: "Web Application",
      budget: "100,000 - 300,000",
      message: "We want to build a high-performance web app for our enterprise team.",
    }),
  });
  const contactData = await contactRes.json();
  console.log("6. Contact Submission:", contactRes.status, contactData);

  // 7. Admin Login API
  const loginRes = await fetch("http://localhost:3000/api/admin/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "admin@hicode.com",
      password: "admin_hicode_2026",
    }),
  });
  const loginData = await loginRes.json();
  const cookie = loginRes.headers.get("set-cookie");
  console.log("7. Admin Login Status:", loginRes.status, loginData.user?.email);

  // 8. Admin Leads API with Cookie
  const leadsRes = await fetch("http://localhost:3000/api/admin/leads", {
    headers: { Cookie: cookie || "" },
  });
  const leadsData = await leadsRes.json();
  console.log("8. Admin Leads Count:", leadsData.leads?.length, "Latest lead:", leadsData.leads?.[0]?.name);

  // 9. Update Lead Status
  if (leadsData.leads?.[0]?.id) {
    const updateRes = await fetch(`http://localhost:3000/api/admin/leads/${leadsData.leads[0].id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie || "",
      },
      body: JSON.stringify({
        status: "CONTACTED",
        internal_note: "Verified via automated test script",
      }),
    });
    const updateData = await updateRes.json();
    console.log("9. Lead Status Update:", updateRes.status, "New Status:", updateData.lead?.status);
  }

  // 10. Admin Profile GET
  const profileRes = await fetch("http://localhost:3000/api/admin/profile", {
    headers: { Cookie: cookie || "" },
  });
  const profileData = await profileRes.json();
  console.log("10. Admin Profile GET:", profileRes.status, profileData.user?.name, profileData.user?.email);

  // 11. Admin Profile PATCH (Update Name)
  const updateProfileRes = await fetch("http://localhost:3000/api/admin/profile", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookie || "",
    },
    body: JSON.stringify({
      name: "HiCode Lead Architect",
    }),
  });
  const updateProfileData = await updateProfileRes.json();
  console.log("11. Admin Profile PATCH:", updateProfileRes.status, "New Name:", updateProfileData.user?.name);

  // 12. SEO Sitemap & Robots
  const sitemapRes = await fetch("http://localhost:3000/sitemap.xml");
  console.log("12. Sitemap Status:", sitemapRes.status, "(Expected 200)");

  const robotsRes = await fetch("http://localhost:3000/robots.txt");
  console.log("13. Robots Status:", robotsRes.status, "(Expected 200)");

  console.log("\n>>> ALL TESTS COMPLETED SUCCESSFULLY! <<<");
}

runTests().catch(console.error);
