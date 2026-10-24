(function (global) {

  function crearUsuariosIniciales() {
    return [
      { name: "Juan", email: "juan@test.com" },
      { name: "Maria", email: "maria@test.com" },
      { name: "Pedro", email: "pedro@test.com" }
    ];
  }

  function autenticarUsuario(email, password) {
    return email === "admin@test.com" && password === "Password123";
  }

  function filtrarUsuarios(users, texto) {
    const value = (texto || "").toLowerCase();
    return users.filter(user => user.name.toLowerCase().includes(value));
  }

  function registrarUsuario(users, name, email) {
    if (!name || !email) {
      return {
        ok: false,
        users: users,
        mensaje: "Todos los campos son obligatorios"
      };
    }

    return {
      ok: true,
      users: users.concat([{ name: name, email: email }]),
      mensaje: "Usuario registrado correctamente"
    };
  }

  function formatearUsuario(user) {
    return user.name + " - " + user.email;
  }

  function iniciarApp(doc) {
    let users = crearUsuariosIniciales();

    const $ = id => doc.getElementById(id);

    const loginSection = $("loginSection");
    const panelSection = $("panelSection");

    $("loginButton").addEventListener("click", () => {
      const message = $("loginMessage");

      if (autenticarUsuario($("email").value, $("password").value)) {
        loginSection.classList.add("hidden");
        panelSection.classList.remove("hidden");
        message.textContent = "";
      } else {
        message.textContent = "Correo o contraseña incorrectos";
        message.className = "error";
      }
    });

    $("logoutButton").addEventListener("click", () => {
      panelSection.classList.add("hidden");
      loginSection.classList.remove("hidden");
    });

    $("searchTab").addEventListener("click", () => {
      $("searchSection").classList.remove("hidden");
      $("registerSection").classList.add("hidden");
    });

    $("searchButton").addEventListener("click", () => {
      const results = $("searchResults");
      results.innerHTML = "";

      const filtered = filtrarUsuarios(users, $("searchInput").value);

      if (filtered.length === 0) {
        results.innerHTML = "<p>No se encontraron usuarios</p>";
        return;
      }

      filtered.forEach(user => {
        const div = doc.createElement("div");
        div.className = "user";
        div.textContent = formatearUsuario(user);
        results.appendChild(div);
      });
    });

    $("registerTab").addEventListener("click", () => {
      $("registerSection").classList.remove("hidden");
      $("searchSection").classList.add("hidden");
    });

    $("registerButton").addEventListener("click", () => {
      const message = $("registerMessage");
      const resultado = registrarUsuario(users, $("nameInput").value, $("registerEmail").value);

      message.textContent = resultado.mensaje;

      if (!resultado.ok) {
        message.className = "error";
        return;
      }

      users = resultado.users;
      message.className = "success";
      $("nameInput").value = "";
      $("registerEmail").value = "";
    });

    return {
      obtenerUsuarios: () => users
    };
  }

  const api = {
    crearUsuariosIniciales,
    autenticarUsuario,
    filtrarUsuarios,
    registrarUsuario,
    formatearUsuario,
    iniciarApp
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    global.GestorUsuarios = api;
    iniciarApp(global.document);
  }

})(typeof window !== "undefined" ? window : globalThis);
