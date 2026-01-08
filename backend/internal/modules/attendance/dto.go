package attendance

import "time"

type ClockRequest struct {
	Latitude    float64 `json:"latitude" validate:"required"`
	Longitude   float64 `json:"longitude" validate:"required"`
	ImageBase64 string  `json:"image_base64" validate:"required"`
	Address     string  `json:"address"`
	Notes       string  `json:"notes"`
}

type AttendanceResponse struct {
	Type    string    `json:"type"`
	Status  string    `json:"status"`
	Time    time.Time `json:"time"`
	Message string    `json:"message"`
}

type TodayStatusResponse struct {
	Status       string     `json:"status"`
	Type         string     `json:"type"`
	CheckInTime  *time.Time `json:"check_in_time"`
	CheckOutTime *time.Time `json:"check_out_time"`
	WorkDuration string     `json:"work_duration"`
}
