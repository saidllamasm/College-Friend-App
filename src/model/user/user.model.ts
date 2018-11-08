export interface UserCustom {
  key?: string;
  configuracion : {
    buscando : boolean;
    notificaciones : boolean;
  },
  email: string;
  estado : string;
  favs : {
    token_university : string;
  }
  metodo : string;
  nombre: string;
  reputacion: string;
  rol: string;
  telefono: string;
  reviews : {
    token_review : string;
  }
}