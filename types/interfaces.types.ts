export interface ILocations {
  id: number;
  name: string;
}

export interface ITasks {
  id: number;
  title: string;
  description: string;
  isUrgent: boolean;
  locationId: number;
  imageUri: string | null;
}
