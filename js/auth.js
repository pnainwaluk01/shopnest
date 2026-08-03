/* ==========================================================================
   Auth pages: real-time validation for Login, Register, and Forgot Password.
   No backend — successful submission stores a mock session in localStorage.
   ========================================================================== */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

document.addEventListener("DOMContentLoaded", () => {
  wirePasswordToggles();
  initLoginForm();
  initRegisterForm();
  initForgotPasswordForm();
});

function setError(input, message) {
  input.classList.toggle("invalid", Boolean(message));
  const error = input.closest(".form-group")?.querySelector(".form-error");
  if (error) {
    if (message) error.textContent = message;
    error.classList.toggle("show", Boolean(message));
  }
}

function wirePasswordToggles() {
  document.querySelectorAll("[data-toggle-password]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const input = document.getElementById(btn.dataset.togglePassword);
      const showing = input.type === "text";
      input.type = showing ? "password" : "text";
      btn.querySelector("use").setAttribute("href", iconHref(showing ? "icon-eye" : "icon-eye-off"));
    });
  });
}

/* ---------- login ---------- */

function initLoginForm() {
  const form = document.getElementById("login-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;

    if (!EMAIL_REGEX.test(form.email.value.trim())) {
      setError(form.email, "Please enter a valid email address.");
      valid = false;
    } else {
      setError(form.email, "");
    }

    if (form.password.value.length < 6) {
      setError(form.password, "Password must be at least 6 characters.");
      valid = false;
    } else {
      setError(form.password, "");
    }

    if (!valid) return;

    const namePart = form.email.value.split("@")[0].replace(/[._]/g, " ");
    const name = namePart.replace(/\b\w/g, (c) => c.toUpperCase());
    saveSession({ name, email: form.email.value.trim() });
    showToast(`Welcome back, ${name.split(" ")[0]}!`);
    setTimeout(() => (window.location.href = "../index.html"), 700);
  });
}

/* ---------- register ---------- */

function initRegisterForm() {
  const form = document.getElementById("register-form");
  if (!form) return;

  form.password.addEventListener("input", () => updatePasswordStrength(form.password.value));

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;

    if (form.fullName.value.trim().length < 2) {
      setError(form.fullName, "Please enter your full name.");
      valid = false;
    } else setError(form.fullName, "");

    if (!EMAIL_REGEX.test(form.email.value.trim())) {
      setError(form.email, "Please enter a valid email address.");
      valid = false;
    } else setError(form.email, "");

    const passwordOk = form.password.value.length >= 8 && /\d/.test(form.password.value);
    if (!passwordOk) {
      setError(form.password, "Password must be 8+ characters and include a number.");
      valid = false;
    } else setError(form.password, "");

    if (form.confirmPassword.value !== form.password.value || !form.confirmPassword.value) {
      setError(form.confirmPassword, "Passwords do not match.");
      valid = false;
    } else setError(form.confirmPassword, "");

    if (!form.terms.checked) {
      document.querySelector("[data-terms-error]")?.classList.add("show");
      valid = false;
    } else {
      document.querySelector("[data-terms-error]")?.classList.remove("show");
    }

    if (!valid) return;

    saveSession({ name: form.fullName.value.trim(), email: form.email.value.trim() });
    showToast(`Account created! Welcome, ${form.fullName.value.trim().split(" ")[0]}.`);
    setTimeout(() => (window.location.href = "../index.html"), 700);
  });
}

function updatePasswordStrength(value) {
  const bar = document.querySelector("[data-password-strength-bar]");
  if (!bar) return;
  let score = 0;
  if (value.length >= 8) score++;
  if (/\d/.test(value)) score++;
  if (/[A-Z]/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value)) score++;
  const percentages = [15, 35, 65, 85, 100];
  const colors = ["#dc2626", "#dc2626", "#f59e0b", "#2a9d8f", "#16a34a"];
  bar.style.width = value ? `${percentages[score]}%` : "0%";
  bar.style.background = colors[score];
}

/* ---------- forgot password ---------- */

function initForgotPasswordForm() {
  const form = document.getElementById("forgot-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!EMAIL_REGEX.test(form.email.value.trim())) {
      setError(form.email, "Please enter a valid email address.");
      return;
    }
    setError(form.email, "");

    document.querySelector("[data-forgot-form-view]").hidden = true;
    const successView = document.querySelector("[data-forgot-success-view]");
    successView.hidden = false;
    successView.querySelector("[data-sent-email]").textContent = form.email.value.trim();
  });
}
