package utils

import (
	"bytes"
	"encoding/base64"
	"errors"
	"strings"
)

func DecodeBase64Image(data string) ([]byte, error) {
	idx := strings.Index(data, ";base64,")
	if idx != -1 {
		data = data[idx+8:]
	}

	decoded, err := base64.StdEncoding.DecodeString(data)
	if err != nil {
		return nil, errors.New("invalid base64 image data")
	}
	return decoded, nil
}

func ConvertToReadSeeker(data []byte) *bytes.Reader {
	return bytes.NewReader(data)
}
