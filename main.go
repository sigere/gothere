package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"os"
)

var connection *Connection

func main() {
	fmt.Println("Hello World")

	err := godotenv.Load()
	if err != nil {
		panic("Unable to load .env file")
	}

	connection = GetConnection()
	err = migrate(connection)
	if err != nil {
		return
	}

	gin.SetMode(os.Getenv("GIN_MODE"))
	r := gin.New()
	configureRoutes(r)
	_ = r.Run(":" + os.Getenv("PORT"))
}

func configureRoutes(r *gin.Engine) {
	r.StaticFile("/", "./static/index.html")
	r.StaticFile("/favicon.ico", "./static/favicon.ico")
	r.Static("/static/js", "./static/js")

	v1 := r.Group("/api/v1/")
	path := v1.Group("/path")

	configurePathRoutes(path)
}

func migrate(connection *Connection) error {
	return connection.AutoMigrate(
		&Path{},
		&Point{},
	)
}
