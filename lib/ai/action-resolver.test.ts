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
const showCodenarts = resolveAction({ type: "show_project", target: "codenarts" });
assert(showCodenarts !== null && showCodenarts.target === "/projects/codenarts", "showCodenarts should resolve to /projects/codenarts");

const showWithPath = resolveAction({ type: "show_project", target: "/projects/amron" });
assert(showWithPath !== null && showWithPath.target === "/projects/amron", "showWithPath should resolve to /projects/amron");

const showFakeProject = resolveAction({ type: "show_project", target: "crypto-scam" });
assert(showFakeProject === null, "showFakeProject should be rejected");

// Test 3: download_resume
const resumeAction = resolveAction({ type: "download_resume", target: "https://malicious.com/fake.pdf" });
assert(resumeAction !== null && resumeAction.target === "/resume/Kshitij_Resume.pdf", "download_resume must lock to /resume/Kshitij_Resume.pdf");

// Test 4: open_url allowed vs disallowed
const validGithub = resolveAction({ type: "open_url", target: "https://github.com/Kshitij-Vijay-Pawar" });
assert(validGithub !== null && validGithub.target === "https://github.com/Kshitij-Vijay-Pawar", "github URL should be approved");

const validLinkedin = resolveAction({ type: "open_url", target: "https://www.linkedin.com/in/kshitij" });
assert(validLinkedin !== null && validLinkedin.target === "https://www.linkedin.com/in/kshitij", "subdomain of linkedin.com should be approved");

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
  { type: "show_project", target: "finance" },
  { type: "none" },
]);
assert(batch.length === 2, "batch should resolve exactly 2 valid actions");
assert(batch[0].target === "/contact", "batch[0] should be /contact");
assert(batch[1].target === "/projects/finance", "batch[1] should be /projects/finance");

console.log("All action-resolver tests passed successfully! ✅");
