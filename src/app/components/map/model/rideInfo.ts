export interface RideInfo {
  locations : {
    departure : {
      adsress: String,
      latitude: Float32Array,
      longitude: Float32Array,
    };
    destination : {
      adsress: String,
      latitude: Float32Array,
      longitude: Float32Array,
    };
  }
  vehicleType: VehicleType,
  babyTransport: Boolean,
  petTransport: Boolean,
}
  
enum VehicleType{
  STANDARDNO, LUKSUZNO, KOMBI
}