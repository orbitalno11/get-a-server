import pandas as pd
from models.rfm import RFM


data = pd.read_csv('data/rfm_data1.csv')
rfm = RFM(data)
rfm.calculate_rfm()