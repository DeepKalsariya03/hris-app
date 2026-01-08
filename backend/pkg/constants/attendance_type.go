package constants

type AttendanceType string

const (
	AttendanceTypeCheckIn   AttendanceType = "CHECK_IN"
	AttendanceTypeCheckOut  AttendanceType = "CHECK_OUT"
	AttendanceTypeNone      AttendanceType = "NONE"
	AttendanceTypeCompleted AttendanceType = "COMPLETED"
)
