package main

import (
	"context"
	"flag"
	"io"
	"log"
	"time"

	pb "github.com/gfg/djtestpoms/djtestpoms"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

var (
	addr = flag.String("addr", "localhost:8080", "the address to connect to")
)

func main() {
	flag.Parse()

	// Set up a connection to the server.
	conn, err := grpc.Dial(*addr, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalf("did not connect: %v", err)
	}
	defer conn.Close()
	c := pb.NewStoreManagerClient(conn)

	// Contact the server and print out its response.
	ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	defer cancel()

	product, _ := CreateProduct(c, ctx)
	EditProduct(c, ctx, product)
	GetProducts(c, ctx)
	SearchProducts(c, ctx)

	GetCategories(c, ctx)
	order, _ := CreateOrder(c, ctx)
	ChangeOrderStatus(c, ctx, order.Id)
	GetOrders(c, ctx)
}

func CreateProductWithIncorrectToken(c pb.StoreManagerClient, ctx context.Context) {
	r, err := c.CreateProduct(ctx, &pb.CreateProductRequest{
		ApiKey:     "123",
		Name:       "Test Product",
		Color:      "Red",
		Price:      23.42,
		CategoryId: 7,
	})

	log.Printf("Response: %v, Error: %v", r, err)

}

func CreateProduct(c pb.StoreManagerClient, ctx context.Context) (*pb.Product, error) {
	r, err := c.CreateProduct(ctx, &pb.CreateProductRequest{
		ApiKey:     "dQw4w9WgXcQ",
		Name:       "Test Product",
		Color:      "Red",
		Price:      23.42,
		CategoryId: 7,
	})
	log.Printf("Response: %v, Error: %v", r, err)
	return r, err
}

func EditProduct(c pb.StoreManagerClient, ctx context.Context, product *pb.Product) {
	r, err := c.EditProduct(ctx, &pb.ProductRequest{
		ApiKey: "dQw4w9WgXcQ",
		Product: &pb.Product{
			Id:         product.Id,
			Name:       "Sandals",
			Color:      "Brown",
			Price:      91.99,
			CategoryId: product.CategoryId,
		},
	})
	log.Printf("Response: %v, Error: %v", r, err)
}

func GetProducts(c pb.StoreManagerClient, ctx context.Context) {
	s, err := c.GetProducts(ctx, &pb.GetProductsRequest{ApiKey: "dQw4w9WgXcQ", Ids: []int64{14, 17, 32, 42}})
	if err != nil {
		log.Fatal(err)
	}
	for {
		r, err := s.Recv()
		if err == io.EOF {
			break
		}
		log.Printf("Response: %v", r)
	}
}

func SearchProducts(c pb.StoreManagerClient, ctx context.Context) {
	s, err := c.SearchProducts(ctx, &pb.SearchProductsRequest{ApiKey: "dQw4w9WgXcQ", Name: "i"})
	if err != nil {
		log.Fatal(err)
	}
	for {
		r, err := s.Recv()
		if err == io.EOF {
			break
		}
		log.Printf("Response: %v", r)
	}
}

func GetCategories(c pb.StoreManagerClient, ctx context.Context) {
	s, err := c.GetCategories(ctx, &pb.EmptyRequest{ApiKey: "dQw4w9WgXcQ"})
	if err != nil {
		log.Fatal(err)
	}
	for {
		r, err := s.Recv()
		if err == io.EOF {
			break
		}
		log.Printf("Response: %v", r)
	}
}

func CreateOrder(c pb.StoreManagerClient, ctx context.Context) (*pb.Order, error) {
	r, err := c.CreateOrder(ctx, &pb.CreateOrderRequest{
		ApiKey: "dQw4w9WgXcQ",
		Items: map[int64]int64{
			17:  2,
			143: 7,
		},
	})
	log.Printf("Response: %v, Error: %v", r, err)

	return r, err
}

func ChangeOrderStatus(c pb.StoreManagerClient, ctx context.Context, id int64) {
	r, err := c.ChangeOrderStatus(ctx, &pb.ChangeOrderStatusRequest{
		ApiKey:  "dQw4w9WgXcQ",
		OrderId: id,
		Status:  pb.OrderStatus_READY_TO_SHIP,
	})
	log.Printf("Response: %v, Error: %v", r, err)
}

func GetOrders(c pb.StoreManagerClient, ctx context.Context) {
	s, err := c.GetOrders(ctx, &pb.EmptyRequest{ApiKey: "dQw4w9WgXcQ"})
	if err != nil {
		log.Fatal(err)
	}
	for {
		r, err := s.Recv()
		if err == io.EOF {
			break
		}
		log.Printf("Response: %v", r)
	}
}
