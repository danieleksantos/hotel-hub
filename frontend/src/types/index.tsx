export interface User {
    id: string;
    username: string;
    token?: string;
}

export interface Hotel {
    id: string;
    name: string;
    city: string;
    address: string;
    state?: string;
    stars: number;
    total_rooms: number;
    description?: string;
    photo_url?: string | null;
    created_at?: string;
}

export interface Booking {
    id: string;
    hotel_id: string;
    user_id?: string;
    
    hotel_name: string;
    hotel_photo?: string;
    city?: string;
    created_by?: string;
    
    guest_count: number; 

    responsible_name: string;
    start_date: string;
    end_date: string;
    created_at?: string;
}

export interface Guest {
    id: string;
    booking_id: string;
    name: string;
    document: string;
    created_at?: string;
}

export type HotelFormData = Omit<Hotel, 'id' | 'created_at'>;