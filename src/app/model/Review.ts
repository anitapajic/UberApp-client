export interface Review{
    rating: number | null;
    rideId: number;
    comment: string;
    driver: number;
}
export interface ReviewDTO{
    rating: number | null;
    ride: number;
    comment: string;
    driver: number;
}
