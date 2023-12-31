package utils

import (
	"fmt"
	"sync"
	"time"
)

type TimedQueue struct {
	mu        sync.Mutex
	items     []Item
	timerSet  *time.Timer
	StartTime time.Time
	SetTime   int
	Duration  int
}

type Item struct {
	Value   string
	SetTime int
}

func NewTimedQueue(duration int) *TimedQueue {
	return &TimedQueue{
		items:    make([]Item, 0),
		Duration: duration,
	}
}

func (q *TimedQueue) Enqueue(item string) {
	q.mu.Lock()
	defer q.mu.Unlock()

	if len(q.items) == 0 {
		q.items = append(q.items, Item{Value: item, SetTime: 0})
		q.StartTime = time.Now()
		q.SetTime = q.Duration
		q.timerSet = time.AfterFunc(time.Duration(q.Duration)*time.Second, func() { q.Dequeue() })
	} else {
		elapsed := q.SetTime - int(time.Since(q.StartTime).Seconds())
		var pst int
		for _, item := range q.items[1:] {
			pst += item.SetTime
		}
		mySet := q.Duration - (elapsed + pst)
		q.items = append(q.items, Item{Value: item, SetTime: mySet})
	}
}

func (q *TimedQueue) Dequeue() {
	q.mu.Lock()
	defer q.mu.Unlock()

	if len(q.items) > 0 {

		// pop item
		item := q.items[0]

		q.items = q.items[1:]
		q.timerSet.Stop()

		// fmt.Println(RemoveSandbox(item.Value))
		fmt.Println(item.Value)
		fmt.Println("remove item from queue")

		if len(q.items) > 0 {
			q.StartTime = time.Now()
			q.SetTime = q.items[0].SetTime
			q.timerSet = time.AfterFunc(time.Duration(q.items[0].SetTime)*time.Second, func() { q.Dequeue() })
		}
	}
}
