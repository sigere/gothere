package main

import (
	"errors"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
	"net/http"
)

type Path struct {
	ID     uint   `gorm:"primary_key"`
	Name   string `json:"name" gorm:"not null"`
	Key    string `json:"-" gorm:"index; not null"`
	Points []Point
}

func configurePathRoutes(rg *gin.RouterGroup) {
	rg.GET("/", getPath)
}

func getPath(context *gin.Context) {
	var p Path

	tx := connection.
		Preload(clause.Associations).
		Where("`key` = ?", context.Query("key")).
		First(&p)

	if errors.Is(tx.Error, gorm.ErrRecordNotFound) {
		context.Data(
			http.StatusNotFound,
			"application/json; charset=utf-8", []byte("No path with given key found."))
		return
	}

	context.JSON(http.StatusOK, p)
}
