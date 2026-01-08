package user

type UserProfileResponse struct {
	ID                uint   `json:"id"`
	Username          string `json:"username"`
	Role              string `json:"role"`
	FullName          string `json:"full_name"`
	NIK               string `json:"nik"`
	DepartmentName    string `json:"department_name"`
	ShiftName         string `json:"shift_name"`
	ShiftStartTime    string `json:"shift_start_time"`
	ShiftEndTime      string `json:"shift_end_time"`
	PhoneNumber       string `json:"phone_number"`
	ProfilePictureUrl string `json:"profile_picture_url"`
}

type UpdateProfileRequest struct {
	PhoneNumber string `form:"phone_number" validate:"required,max=20"`
}

type ChangePasswordRequest struct {
	OldPassword string `json:"old_password" validate:"required"`
	NewPassword string `json:"new_password" validate:"required,min=6"`
}
