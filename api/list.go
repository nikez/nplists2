package main

import (
	"bufio"
	"bytes"
	"encoding/json"
	"fmt"
	"net"
	"net/http"
	"strconv"
	"strings"
	"time"
)

type ServerDetailsStruct struct {
	Players
	ServerQueue
}

type ServerQueue struct {
	CurrentPlayers int64
	CurrentQueue   int64
}

type Players []Player

//Player details
type Player struct {
	ID          int64    `json:"id"`
	Identifiers []string `json:"identifiers"`
	Name        string   `json:"name"`
	Ping        int64    `json:"ping"`
	Twitch      string   `json:"twitch"`
}

var (
	jsonGet = &http.Client{Timeout: 10 * time.Second}
	//ServerAddress to connect to
	ServerAddress = "66.70.181.77:30120"
	//ServerDetails struct to holds PlayerList & ServerDetails struct
	ServerDetails = ServerDetailsStruct{}
)

//GetPlayerList sends HTTP get request to server to get list of players
func getPlayerList() (err error) {
	server := strings.Builder{}
	fmt.Fprintf(&server, "http://%s/players.json", ServerAddress)
	req, err := jsonGet.Get(server.String())
	if err != nil {
		return err
	}
	defer req.Body.Close()
	err = json.NewDecoder(req.Body).Decode(&ServerDetails.Players)
	if err != nil {
		return err
	}
	return
}

//GetServerQueueDetails opens UDP socket to FiveM Server and current players and queue from server details
func getServerQueueDetails() (err error) {
	serverData := make([]byte, 256)
	serverConnection, err := net.Dial("udp", ServerAddress)
	defer serverConnection.Close()
	if err != nil {
		return err
	}
	fmt.Fprintf(serverConnection, "\xFF\xFF\xFF\xFFgetinfo f")
	_, err = bufio.NewReader(serverConnection).Read(serverData)

	if err == nil {
		serverData := bytes.Split(serverData, []byte("\n"))
		serverDetails := bytes.Split(serverData[1], []byte("\\"))
		serverQueue := bytes.FieldsFunc(serverDetails[12], func(c rune) bool { return c == '[' || c == ']' })

		currentPlayerValues, _ := strconv.ParseInt(string(serverDetails[4]), 0, 64)
		currentserverQueueValues, _ := strconv.ParseInt(string(serverQueue[0]), 0, 64)
		ServerDetails.ServerQueue.CurrentPlayers = currentPlayerValues
		if currentserverQueueValues >= 1 {
			ServerDetails.ServerQueue.CurrentQueue = currentserverQueueValues
		}
	} else {
		return err
	}
	return
}

//List handler for now.sh /api/list route
func List(w http.ResponseWriter, r *http.Request) {
	getPlayerList()
	getServerQueueDetails()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(ServerDetails)
}
