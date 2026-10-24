const fs = require("fs");
const path = require("path");
const { iniciarApp } = require("../app/app");

const html = fs.readFileSync(path.join(__dirname, "../app/index.html"), "utf8");

const $ = id => document.getElementById(id);
const click = id => $(id).click();

function login(email = "admin@test.com", password = "Password123") {
  $("email").value = email;
  $("password").value = password;
  click("loginButton");
}

let app;

beforeEach(() => {
  document.documentElement.innerHTML = html;
  app = iniciarApp(document);
});

describe("login", () => {
  test("credenciales válidas muestran el panel", () => {
    login();

    expect($("loginSection").classList.contains("hidden")).toBe(true);
    expect($("panelSection").classList.contains("hidden")).toBe(false);
    expect($("loginMessage").textContent).toBe("");
  });

  test("credenciales inválidas muestran error", () => {
    login("x@test.com", "mal");

    expect($("loginMessage").textContent).toBe("Correo o contraseña incorrectos");
    expect($("loginMessage").className).toBe("error");
    expect($("panelSection").classList.contains("hidden")).toBe(true);
  });

  test("logout vuelve al login", () => {
    login();
    click("logoutButton");

    expect($("panelSection").classList.contains("hidden")).toBe(true);
    expect($("loginSection").classList.contains("hidden")).toBe(false);
  });
});

describe("pestañas", () => {
  test("buscar muestra búsqueda y oculta registro", () => {
    login();
    click("registerTab");
    click("searchTab");

    expect($("searchSection").classList.contains("hidden")).toBe(false);
    expect($("registerSection").classList.contains("hidden")).toBe(true);
  });

  test("registrar muestra registro y oculta búsqueda", () => {
    login();
    click("searchTab");
    click("registerTab");

    expect($("registerSection").classList.contains("hidden")).toBe(false);
    expect($("searchSection").classList.contains("hidden")).toBe(true);
  });
});

describe("búsqueda", () => {
  test("muestra el usuario encontrado", () => {
    login();
    click("searchTab");
    $("searchInput").value = "Juan";
    click("searchButton");

    const items = $("searchResults").querySelectorAll(".user");
    expect(items).toHaveLength(1);
    expect(items[0].textContent).toBe("Juan - juan@test.com");
  });

  test("sin resultados muestra mensaje", () => {
    login();
    click("searchTab");
    $("searchInput").value = "Zoe";
    click("searchButton");

    expect($("searchResults").textContent).toBe("No se encontraron usuarios");
  });

  test("limpia resultados anteriores", () => {
    login();
    click("searchTab");
    $("searchInput").value = "";
    click("searchButton");
    $("searchInput").value = "Pedro";
    click("searchButton");

    expect($("searchResults").querySelectorAll(".user")).toHaveLength(1);
  });
});

describe("registro", () => {
  test("registra y limpia el formulario", () => {
    login();
    click("registerTab");
    $("nameInput").value = "Carlos";
    $("registerEmail").value = "carlos@test.com";
    click("registerButton");

    expect($("registerMessage").textContent).toBe("Usuario registrado correctamente");
    expect($("registerMessage").className).toBe("success");
    expect($("nameInput").value).toBe("");
    expect($("registerEmail").value).toBe("");
    expect(app.obtenerUsuarios()).toHaveLength(4);
  });

  test("el usuario registrado aparece en la búsqueda", () => {
    login();
    click("registerTab");
    $("nameInput").value = "Carlos";
    $("registerEmail").value = "carlos@test.com";
    click("registerButton");

    click("searchTab");
    $("searchInput").value = "carlos";
    click("searchButton");

    expect($("searchResults").textContent).toContain("Carlos - carlos@test.com");
  });

  test("campos vacíos muestran error", () => {
    login();
    click("registerTab");
    click("registerButton");

    expect($("registerMessage").textContent).toBe("Todos los campos son obligatorios");
    expect($("registerMessage").className).toBe("error");
    expect(app.obtenerUsuarios()).toHaveLength(3);
  });
});
