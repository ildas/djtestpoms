package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"net"
	"strings"

	pb "github.com/gfg/djtestpoms/djtestpoms"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

var (
	port         = flag.Int("port", 8080, "The server port")
	apiKey       = flag.String("api-key", "dQw4w9WgXcQ", "API Key to authorise the clients")
	lastId int64 = 200
)

type server struct {
	pb.UnimplementedStoreManagerServer
}

var PRODUCTS = map[int64]*pb.Product{
	14:  {Id: 14, Name: "Swimwear", Color: "Red", Price: 53.71, CategoryId: 7},
	17:  {Id: 17, Name: "Blazer", Color: "Black", Price: 139.99, CategoryId: 7},
	42:  {Id: 42, Name: "Skirt", Color: "White", Price: 17.49, CategoryId: 7},
	79:  {Id: 79, Name: "Cufflinks", Color: "Golden", Price: 99.99, CategoryId: 9},
	143: {Id: 143, Name: "Scarf", Color: "Blue", Price: 19.99, CategoryId: 7},
}

var CATEGORIES = map[int64]*pb.Category{
	7: {Id: 7, Name: "Clothing"},
	9: {Id: 9, Name: "Jewelry"},
}

var ORDERS = map[int64]*pb.Order{
	11:  {Id: 11, Status: pb.OrderStatus_CREATED, Items: map[int64]int64{14: 2, 17: 8}},
	21:  {Id: 21, Status: pb.OrderStatus_READY_TO_SHIP, Items: map[int64]int64{14: 1}},
	71:  {Id: 71, Status: pb.OrderStatus_READY_TO_SHIP, Items: map[int64]int64{17: 4}},
	132: {Id: 132, Status: pb.OrderStatus_SHIPPED, Items: map[int64]int64{79: 1, 143: 1}},
	143: {Id: 143, Status: pb.OrderStatus_DELIVERED, Items: map[int64]int64{14: 2, 17: 1, 42: 4}},
	147: {Id: 147, Status: pb.OrderStatus_CANCELLED, Items: map[int64]int64{14: 2, 17: 1}},
}

func (s *server) CreateProduct(ctx context.Context, in *pb.CreateProductRequest) (*pb.Product, error) {
	if in.ApiKey != *apiKey {
		err := status.Error(codes.Unauthenticated, "Incorrect API key")
		log.Print(err)
		return nil, err
	}

	log.Printf("CreateProduct: %v", in)

	lastId += 1

	product := &pb.Product{
		Id:         lastId,
		Name:       in.Name,
		Color:      in.Color,
		Price:      in.Price,
		CategoryId: in.CategoryId,
	}

	PRODUCTS[product.Id] = product

	return product, nil
}

func (s *server) EditProduct(ctx context.Context, in *pb.ProductRequest) (*pb.Product, error) {
	if in.ApiKey != *apiKey {
		err := status.Error(codes.Unauthenticated, "Incorrect API key")
		log.Print(err)
		return nil, err
	}

	if PRODUCTS[in.Product.Id] == nil {
		err := status.Error(codes.NotFound, "Product not found")
		log.Print(err)
		return nil, err
	}

	PRODUCTS[in.Product.Id] = in.Product

	return in.Product, nil
}

func (s *server) GetProducts(in *pb.GetProductsRequest, server pb.StoreManager_GetProductsServer) error {
	if in.ApiKey != *apiKey {
		err := status.Error(codes.Unauthenticated, "Incorrect API key")
		log.Print(err)
		return err
	}

	for _, id := range in.Ids {
		product := PRODUCTS[id]
		server.Send(&pb.ProductStreamResponse{Product: product})
	}

	return nil
}

func (s *server) SearchProducts(in *pb.SearchProductsRequest, server pb.StoreManager_SearchProductsServer) error {
	if in.ApiKey != *apiKey {
		err := status.Error(codes.Unauthenticated, "Incorrect API key")
		log.Print(err)
		return err
	}

	for _, product := range PRODUCTS {
		if strings.Contains(product.Name, in.Name) {
			server.Send(&pb.ProductStreamResponse{Product: product})
		}
	}

	return nil
}

func (s *server) GetCategories(in *pb.EmptyRequest, server pb.StoreManager_GetCategoriesServer) error {
	if in.ApiKey != *apiKey {
		err := status.Error(codes.Unauthenticated, "Incorrect API key")
		log.Print(err)
		return err
	}

	for _, category := range CATEGORIES {
		server.Send(category)
	}

	return nil
}

func (s *server) CreateOrder(ctx context.Context, in *pb.CreateOrderRequest) (*pb.Order, error) {
	if in.ApiKey != *apiKey {
		err := status.Error(codes.Unauthenticated, "Incorrect API key")
		log.Print(err)
		return nil, err
	}

	log.Printf("CreateOrder: %v", in.Items)

	lastId += 1

	order := &pb.Order{
		Id:     lastId,
		Status: pb.OrderStatus_CREATED,
		Items:  in.Items,
	}

	ORDERS[order.Id] = order

	return order, nil
}

func (s *server) ChangeOrderStatus(ctx context.Context, in *pb.ChangeOrderStatusRequest) (*pb.Order, error) {
	if in.ApiKey != *apiKey {
		err := status.Error(codes.Unauthenticated, "Incorrect API key")
		log.Print(err)
		return nil, err
	}

	order := ORDERS[in.OrderId]

	if order == nil {
		err := status.Error(codes.NotFound, "Order Not Found")
		log.Print(err)
		return nil, err
	}

	log.Printf("ChangeOrderStatus: %v (%v => %v)", in.OrderId, order.Status, in.Status)
	order.Status = in.Status

	return order, nil
}

func (s *server) GetOrders(in *pb.EmptyRequest, server pb.StoreManager_GetOrdersServer) error {
	if in.ApiKey != *apiKey {
		err := status.Error(codes.Unauthenticated, "Incorrect API key")
		log.Print(err)
		return err
	}

	for _, order := range ORDERS {
		server.Send(order)
	}

	return nil
}

func main() {
	flag.Parse()
	lis, err := net.Listen("tcp", fmt.Sprintf(":%d", *port))
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	s := grpc.NewServer()
	pb.RegisterStoreManagerServer(s, &server{})
	log.Printf("server listening at %v", lis.Addr())
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
