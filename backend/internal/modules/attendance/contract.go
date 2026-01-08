package attendance

import (
	"context"
	"io"
)

type StorageProvider interface {
	UploadFileByte(ctx context.Context, objectName string, reader io.Reader, size int64, contentType string) (string, error)
}

type LocationFetcher interface {
	GetAddressFromCoords(lat, long float64) string
}
