const {
  crearUsuariosIniciales,
  autenticarUsuario,
  filtrarUsuarios,
  registrarUsuario,
  formatearUsuario
} = require("../app/app");

describe("autenticarUsuario", () => {
  test("acepta las credenciales válidas", () => {
    expect(autenticarUsuario("admin@test.com", "Password123")).toBe(true);
  });

  test("rechaza contraseña incorrecta", () => {
    expect(autenticarUsuario("admin@test.com", "otra")).toBe(false);
  });

  test("rechaza correo incorrecto", () => {
    expect(autenticarUsuario("otro@test.com", "Password123")).toBe(false);
  });

  test("rechaza campos vacíos", () => {
    expect(autenticarUsuario("", "")).toBe(false);
  });
});

describe("filtrarUsuarios", () => {
  const users = crearUsuariosIniciales();

  test("encuentra por nombre exacto", () => {
    expect(filtrarUsuarios(users, "Juan")).toEqual([
      { name: "Juan", email: "juan@test.com" }
    ]);
  });

  test("no distingue mayúsculas", () => {
    expect(filtrarUsuarios(users, "mARia")).toHaveLength(1);
  });

  test("encuentra coincidencias parciales", () => {
    expect(filtrarUsuarios(users, "e").map(u => u.name)).toEqual(["Pedro"]);
  });

  test("texto vacío devuelve todos", () => {
    expect(filtrarUsuarios(users, "")).toHaveLength(3);
  });

  test("texto undefined devuelve todos", () => {
    expect(filtrarUsuarios(users, undefined)).toHaveLength(3);
  });

  test("sin coincidencias devuelve lista vacía", () => {
    expect(filtrarUsuarios(users, "Zoe")).toEqual([]);
  });
});

describe("registrarUsuario", () => {
  test("registra un usuario válido sin mutar la lista original", () => {
    const users = crearUsuariosIniciales();
    const resultado = registrarUsuario(users, "Carlos", "carlos@test.com");

    expect(resultado.ok).toBe(true);
    expect(resultado.mensaje).toBe("Usuario registrado correctamente");
    expect(resultado.users).toHaveLength(4);
    expect(resultado.users[3]).toEqual({ name: "Carlos", email: "carlos@test.com" });
    expect(users).toHaveLength(3);
  });

  test("falla si falta el nombre", () => {
    const users = crearUsuariosIniciales();
    const resultado = registrarUsuario(users, "", "a@test.com");

    expect(resultado.ok).toBe(false);
    expect(resultado.mensaje).toBe("Todos los campos son obligatorios");
    expect(resultado.users).toBe(users);
  });

  test("falla si falta el correo", () => {
    expect(registrarUsuario([], "Ana", "").ok).toBe(false);
  });
});

describe("formatearUsuario", () => {
  test("formatea nombre y correo", () => {
    expect(formatearUsuario({ name: "Juan", email: "juan@test.com" }))
      .toBe("Juan - juan@test.com");
  });
});
