export const productsData = [
    {
        id: 1, name: "Calça Vege", price: 289.90, brand: "Carol Modas",
        images: ["assets/images/products/calca-vege.png"],
        description: "Calça com tecido leve e caimento perfeito, ideal para um look casual e elegante.",
        details: ["Tecido leve e confortável", "Cintura com elástico e cordão", "Bolsos laterais funcionais"],
        options: {
            colors: [{ name: "Bege", code: "#D2B48C" }],
            sizes: ["P", "M", "G"]
        }
    },
    {
        id: 2, name: "Blusa Canelada Manga Fina - Preta", price: 89.90, brand: "Carol Modas",
        images: ["assets/images/products/canelado-manga-fina-preto.jpg", "assets/images/products/canelado-manga-fina-vermelho.jpg"],
        description: "Blusa canelada de manga curta, uma peça versátil e indispensável. Tecido com elasticidade que se ajusta ao corpo.",
        details: ["Tecido canelado com elasticidade", "Gola redonda clássica", "Ideal para compor looks diversos"],
        options: {
            colors: [{ name: "Preto", code: "#212121" }, { name: "Vermelho", code: "#B22222" }],
            sizes: ["P", "M", "G", "GG"]
        }
    },
    { id: 3, name: "Blusa Canelada Manga Fina - Vermelha", price: 89.90, brand: "Carol Modas", images: ["assets/images/products/canelado-manga-fina-vermelho.jpg", "assets/images/products/canelado-manga-fina-preto.jpg"], options: { colors: [{ name: "Vermelho", code: "#B22222" }, { name: "Preto", code: "#212121" }], sizes: ["P", "M", "G", "GG"] }, details: ["Detalhe para Blusa Vermelha."] },
    { id: 4, name: "Blusa Canelada", price: 99.90, brand: "Carol Modas", images: ["assets/images/products/canelado.png"], options: { colors: [{ name: "Rosa", code: "#FFC0CB" }], sizes: ["P", "M", "G"] }, details: ["Detalhe para Blusa Canelada."] },
    { id: 5, name: "Calça Ciganinha", price: 159.90, brand: "Carol Modas", images: ["assets/images/products/ciganinha.png"], options: { colors: [{ name: "Estampado", code: "#000000" }], sizes: ["Único"] }, details: ["Detalhe para Calça Ciganinha."] },
    { id: 6, name: "Blusa Listrada - Vermelha", price: 119.90, brand: "Carol Modas", images: ["assets/images/products/listrado-cor-vermelha.png"], options: { colors: [{ name: "Listrado", code: "#ff4500" }], sizes: ["P", "M", "G"] }, details: ["Detalhe para Blusa Listrada."] },
    { id: 7, name: "Blusa Xadrez - Verde", price: 129.90, brand: "Carol Modas", images: ["assets/images/products/xadrez-verde.png"], options: { colors: [{ name: "Xadrez Verde", code: "#008000" }], sizes: ["M", "G"] }, details: ["Detalhe para Blusa Xadrez."] },
];
