package infrastructure

import (
	"encoding/json"
	"fmt"
	"hris-backend/internal/config"
	"hris-backend/pkg/logger"
	"net/http"
	"time"
)

type nominatimResponse struct {
	DisplayName string `json:"display_name"`
}

type NominatimFetcher struct {
	client *http.Client
	url    string
}

func NewNominatimFetcher(cfg *config.Config) *NominatimFetcher {
	client := &http.Client{Timeout: 10 * time.Second}

	return &NominatimFetcher{
		client: client,
		url:    cfg.ExternalServiceConfig.NominatimUrl,
	}
}

func (n *NominatimFetcher) GetAddressFromCoords(lat, long float64) string {
	url := fmt.Sprintf(n.url, lat, long)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		logger.Errorw("failed fetch address from nominatim ", err)

		return fmt.Sprintf("%f, %f", lat, long)
	}

	req.Header.Set("User-Agent", "HRIS-App-Backend/1.0 (internal-audit)")

	resp, err := n.client.Do(req)
	if err != nil {
		logger.Warnf("failed to fetch nominatim (network/timeout): ", err)

		return fmt.Sprintf("Unknown Location (%f, %f)", lat, long)
	}
	defer resp.Body.Close()

	var result nominatimResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		logger.Errorw("failed decode JSON", err)

		return fmt.Sprintf("%f, %f", lat, long)
	}

	if result.DisplayName == "" {
		return fmt.Sprintf("%f, %f", lat, long)
	}

	return result.DisplayName
}
