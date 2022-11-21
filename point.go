package main

type Point struct {
	ID        uint    `gorm:"primary_key"`
	Name      string  `json:"name" gorm:"not null"`
	Latitude  float64 `json:"latitude" gorm:"not null"`
	Longitude float64 `json:"longitude" gorm:"not null"`
	Index     uint    `json:"index" gorm:"not null"`
	Path      Path    `json:"-"`
	PathID    uint    `json:"-" gorm:"not null"`
}
