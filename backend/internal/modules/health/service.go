package health

type Service interface {
	Check() error
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo}
}

func (s *service) Check() error {
	return s.repo.Check()
}
