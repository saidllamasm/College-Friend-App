export interface University {
    key?: string;
    direccion: string;
    estado : string;
    gps : {
        lat : string,
        lng : string
    };
    nombre: string;
    uid_creador: string;
    website: string;
  }