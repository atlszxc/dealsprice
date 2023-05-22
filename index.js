/**
 * Основной модуль приложения - точка входа. 
 */

const express = require("express");
const api = require("./api");
const logger = require("./logger");
const config = require("./config");
const { getFieldValues, getPrice } = require("./utils");
const { SELECTED_MULTILIST_DEALS_ID, TASK_TYPE_ID, DATE_TO_DEADLINE } = require("./const");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const startServer = async () => {
	const token = api.getAccessToken()
	if(token) {
		app.get("/ping", (_, res) => res.send("pong " + Date.now()));

		app.post("/hook", async (req, res) => {
			// console.log(req.body.task)
			if(req.body.task) {
				console.log(req.body.task)
				if(req.body.task.update[0].action_close === '1') {
					api.addNote(
						{
							entity_id: Number(req.body.task.update[0].element_id),
							note_type: "common",
							params: {
								text: 'Бюджет проверен, ошибок нет'
							}
						}
					)
				}
			
				return
			}
			const [deal] = req.body.leads.update ?? req.body.leads.add
			const customFields = getFieldValues(deal.custom_fields, SELECTED_MULTILIST_DEALS_ID)
			if(!customFields) {
				return logger.error('No selected services')
			}

			const dealData = await api.getDeal(deal.id, ['contacts'])
			if(!dealData._embedded) {
				return logger.error('No contacts in deal')
			}
			const contact = await api.getContact(dealData._embedded.contacts[0].id)
	
			const price = getPrice(customFields, contact.custom_fields_values)

			if(price !== Number(deal.price)) {
				await api.updateDeals({
					id: Number(deal.id),
					price: price
				})
	
				if(!dealData.closest_task_at) {
					await api.createTasks({
						task_type_id: TASK_TYPE_ID,
						text: 'Проверить бюджет',
						entity_id: Number(deal.id),
						entity_type: 'leads',
						complete_till: DATE_TO_DEADLINE
					})
				}
		
				res.send("OK");
			}
		});

		app.listen(config.PORT, () => logger.debug("Server started on ", config.PORT));
	}
}

startServer()
