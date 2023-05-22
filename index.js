/**
 * Основной модуль приложения - точка входа. 
 */

const express = require("express");
const api = require("./api");
const logger = require("./logger");
const config = require("./config");
const { getFieldValues, getPrice } = require("./utils");
const { SELECTED_MULTILIST_DEALS_ID } = require("./const");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const startServer = async () => {
	const token = api.getAccessToken()
	if(token) {
		app.get("/ping", (_, res) => res.send("pong " + Date.now()));

		app.post("/hook", async (req, res) => {
			const [deal] = req.body.leads.update ?? req.body.leads.add
			const customFields = getFieldValues(deal.custom_fields, SELECTED_MULTILIST_DEALS_ID)
			if(!customFields) {
				return logger.error('No selected services')
			}

			const { _embedded: { contacts } } = await api.getDeal(deal.id, ['contacts'])
			console.log(contacts)
			const contact = await api.getContact(contacts[0].id)
	
			if(!contact) {
				return logger.error('No contact in deal')
			}
	
			const price = getPrice(customFields, contact.custom_fields_values)
	
			const updatedDeals = await api.updateDeals({
				id: Number(deal.id),
				price: price
			})
	
			res.send("OK");
		});

		app.listen(config.PORT, () => logger.debug("Server started on ", config.PORT));
	}
}

startServer()
