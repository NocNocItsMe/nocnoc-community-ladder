import requests
from bs4 import BeautifulSoup
from supabase import create_client
import os



SUPABASE_URL = os.environ["SUPABASE_URL"]

SUPABASE_KEY = os.environ["SUPABASE_KEY"]



supabase = create_client(
    SUPABASE_URL,
    SUPABASE_KEY
)



LADDER_URL = (
"https://pathofexile2.com/"
"ladder/HC%20SSF%20Runes%20of%20Aldur"
)



PREFIX = "HCSSFNoc_"





def get_ladder():


    response = requests.get(
        LADDER_URL,
        headers={
            "User-Agent":
            "NocNocCommunityLadder"
        }
    )


    soup = BeautifulSoup(
        response.text,
        "html.parser"
    )


    return soup





def update_characters():


    result = (
        supabase
        .table("characters")
        .select("*")
        .execute()
    )


    characters = result.data



    soup = get_ladder()



    text =
    soup.get_text(
        " ",
        strip=True
    )



    for char in characters:


        name = char["name"]



        if name in text:


            supabase \
            .table("characters") \
            .update({

                "alive":True

            }) \
            .eq(
                "name",
                name
            ) \
            .execute()



            print(
                name,
                "gefunden"
            )


        else:

            print(
                name,
                "nicht gefunden"
            )






if __name__ == "__main__":

    update_characters()