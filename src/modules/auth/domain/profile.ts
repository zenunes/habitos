export type Profile = {
  id: string;
  name: string;
  focus?: string | null;
  profileFrame?: string | null;
  timezone: string;
};

export const sampleProfile: Profile = {
  id: "u1",
  name: "Usuario MVP",
  focus: null,
  profileFrame: null,
  timezone: "America/Sao_Paulo",
};
