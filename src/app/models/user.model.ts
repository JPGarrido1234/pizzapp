export class User {
  id: string;
  login: string;
  password: string;
  name: string;
  address: string;
  zip: string;
  phone: string;
  birthDate: string;
  codeValidated: boolean;
  logged: boolean;
  active: boolean;
  role: string;

  constructor(
    id: string,
    login: string,
    password: string,
    name: string,
    address: string,
    zip: string,
    phone: string,
    birthDate: string,
    codeValidated: boolean,
    logged: boolean,
    active: boolean,
    role: string
  ) {

    /*
    if (role === 'ROLE_SUPERADMIN') {
      throw 'El usuario no puede ser superadmin';
    }
    */

    if (name == null || name == '') {
      throw 'El nombre es requerido';
    }
    // if (address == null || address == '') {
    //     throw 'La dirección es requerida';
    // }
    // if (zip == null || zip == '') {
    //     throw 'El código postal es requerido';
    // }
    if (role !== 'ROLE_SUPERADMIN' && (phone == null || phone == '')) {
      throw 'El teléfono es requerido';
    }
    if (login == null || login == '') {
      throw 'El email es requerido';
    }

    this.id = id;
    this.login = login;
    this.password = password;
    this.name = name;
    this.address = address;
    this.zip = zip;
    this.phone = phone;
    this.birthDate = birthDate;
    this.codeValidated = codeValidated;
    this.logged = logged;
    this.active = active;
    this.role = role;
  }

  public static populate(data: any) {
    return new User(
      data.id,
      data.login,
      data.password,
      data.name,
      data.address,
      data.zip,
      data.phone,
      data.birthDate,
      data.codeValidated,
      data.logged,
      data.active,
      data.role
    );
  }

  public setLogged(logged: boolean): void {
    this.logged = logged;
  }

  public isLogged(): boolean {
    return this.logged;
  }

  public isActive(): boolean {
    return this.active;
  }
}
