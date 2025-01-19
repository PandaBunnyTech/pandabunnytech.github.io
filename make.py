import yaml
from collections import defaultdict

from jinja2 import Environment, FileSystemLoader

PRODUCTS_START = "<!-- PRODUCTS_START -->"
PRODUCTS_END = "<!-- PRODUCTS_END -->"


def generate_text_page(template_name: str):
    with open("index.html", 'r') as h:
        text = h.read()
    start = text.find(PRODUCTS_START)
    end = text.find(PRODUCTS_END) + len(PRODUCTS_END)
    with open(f"_templates/{template_name}.htm", 'r') as about:
        about_text = about.read()
    about = text[:start] + about_text + text[end:]
    with open(f"{template_name}.html", 'w') as j:
        j.write(about)
    print(f"HTML page generated: {template_name}.html")


def main():
    with open('products.yaml', 'r') as file:
        products = yaml.safe_load(file)["products"]

    categories = defaultdict(lambda: defaultdict(list))
    for product in products:
        categories[product["category"]][product["subcategory"]].append(product)
    data = {
        "categories": [

        ]
    }
    for cat in ["Products", "Open Source Projects"]:
        category = categories[cat]
        category_item = {"name": cat, "subcategories": []}
        for subcat in sorted(category.keys()):
            subcategory_products = category[subcat]
            processed_products = []
            for product in subcategory_products:
                if product.get("hide", False):
                    continue
                if "author" not in product:
                    product["author"] = "PandaBunnyTech"
                product["tech"] = sorted(product["tech"].split(","))
                product["icons"] = product["icons"].split(",")
                if not product["desc"].endswith("."):
                    product["desc"] += "."
                processed_products.append(product)
            subcategory_item = {"name": subcat, "products": subcategory_products}
            category_item["subcategories"].append(subcategory_item)
        data["categories"].append(category_item)

    """
    {
        "categories": [
            {
                "name": "open source",
                "subcategories": [
                    {
                        "name": "data science",
                        "products": [
                            {
                                "name": "co2",
                                "author": "blah"
                            }
                        ]
                    }
                ]
            }
        ]
    }
    """

    env = Environment(loader=FileSystemLoader('.'))
    template = env.get_template('_templates/template.htm')

    output = template.render(data=data)

    with open('index.html', 'w') as output_file:
        output_file.write(output)

    print("HTML page generated: index.html")

    generate_text_page("about")
    generate_text_page("404")


if __name__ == "__main__":
    main()
