package models

type Permission string

// Permission constants
const (
	// Admin permissions
	PermissionAdminCreate Permission = "admin:create"
	PermissionAdminList   Permission = "admin:list"
	PermissionAdminView   Permission = "admin:view"
	PermissionAdminUpdate Permission = "admin:update"
	PermissionAdminDelete Permission = "admin:delete"

	// Doctor permissions
	PermissionDoctorCreate  Permission = "doctor:create"
	PermissionDoctorList    Permission = "doctor:list"
	PermissionDoctorView    Permission = "doctor:view"
	PermissionDoctorUpdate  Permission = "doctor:update"
	PermissionDoctorDelete  Permission = "doctor:delete"
	PermissionDoctorApprove Permission = "doctor:approve"
	PermissionDoctorReject  Permission = "doctor:reject"

	// Patient permissions
	PermissionPatientCreate  Permission = "patient:create"
	PermissionPatientList    Permission = "patient:list"
	PermissionPatientView    Permission = "patient:view"
	PermissionPatientUpdate  Permission = "patient:update"
	PermissionPatientDelete  Permission = "patient:delete"
	PermissionPatientHistory Permission = "patient:history"

	// System permissions
	PermissionSystemConfig  Permission = "system:config"
	PermissionSystemMetrics Permission = "system:metrics"
	PermissionSystemLogs    Permission = "system:logs"
)