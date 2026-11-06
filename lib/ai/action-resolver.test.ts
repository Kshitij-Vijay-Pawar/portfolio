import { resolveAction, resolveActions } from "./action-resolver";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

console.log("Running unit tests for action-resolver.ts...");

// Test 1: navigate internal routes
const navHome = resolveAction({ type: "navigate", target: "/", label: "Home" });
assert(navHome !== null && navHome.target === "/", "navHome should resolve to /");

const navProjects = resolveAction({ type: "navigate", target: "projects" });
assert(navProjects !== null && navProjects.target === "/projects", "navProjects should resolve to /projects");

const navInvalid = resolveAction({ type: "navigate", target: "/admin/secret" });
assert(navInvalid === null, "navInvalid should be rejected");

// Test 2: show_project
const showScraper = resolveAction({ type: "show_project", target: "google-maps-scraper" });
assert(showScraper !== null && showScraper.target === "/project/google-maps-scraper", "showScraper should resolve to /project/google-maps-scraper");

const showWithPath = resolveAction({ type: "show_project", target: "/project/edgelink" });
assert(showWithPath !== null && showWithPath.target === "/project/edgelink", "showWithPath should resolve to /project/edgelink");

const showFakeProject = resolveAction({ type: "show_project", target: "crypto-scam" });
assert(showFakeProject === null, "showFakeProject should be rejected");

// Test 3: download_resume
const resumeAction = resolveAction({ type: "download_resume", target: "https://malicious.com/fake.pdf" });
assert(resumeAction !== null && resumeAction.target === "/resume/Kshitij_Resume.pdf", "download_resume must lock to /resume/Kshitij_Resume.pdf");

// Test 4: open_url allowed vs disallowed
const validGithub = resolveAction({ type: "open_url", target: "https://github.com/Kshitij-Vijay-Pawar" });
assert(validGithub !== null && validGithub.target === "https://github.com/Kshitij-Vijay-Pawar", "github URL should be approved");

const validPortfolio = resolveAction({ type: "open_url", target: "https://kshitij-pawar.is-a.dev" });
assert(validPortfolio !== null && validPortfolio.target === "https://kshitij-pawar.is-a.dev", "kshitij-pawar.is-a.dev should be approved");

const maliciousHttp = resolveAction({ type: "open_url", target: "http://github.com/insecure" });
assert(maliciousHttp === null, "http protocol must be rejected");

const attackerUrl = resolveAction({ type: "open_url", target: "https://attacker.com/exploit" });
assert(attackerUrl === null, "attacker.com must be rejected");

const javascriptScheme = resolveAction({ type: "open_url", target: "javascript:alert(1)" });
assert(javascriptScheme === null, "javascript: scheme must be rejected");

// Test 5: batch resolveActions
const batch = resolveActions([
  { type: "navigate", target: "/contact" },
  { type: "open_url", target: "https://attacker.com" },
  { type: "show_project", target: "accentra" },
  { type: "none" },
]);
assert(batch.length === 2, "batch should resolve exactly 2 valid actions");
assert(batch[0].target === "/contact", "batch[0] should be /contact");
assert(batch[1].target === "/project/accentra", "batch[1] should be /project/accentra");

console.log("All action-resolver tests passed successfully! ✅");
