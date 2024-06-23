const jwt = require("jsonwebtoken");

async function Login(email, password, response, dataSource) {
  const user = await dataSource
    .getRepository("User")
    .findOne({ where: { email: email.toLowerCase() } });

  if (!user) {
    return response.status(400).send("Usuário não encontrado!");
  }

  if (user.password !== password) {
    return response.status(401).send("Senha incorreta");
  }

  const token = jwt.sign(
    { name: user.name, email: user.email, phone: user.phone },
    process.env.TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );

  return response.status(200).send(token);
}

async function RegisterUser(
  name,
  password,
  email,
  phone,
  response,
  dataSource
) {
  if (name?.length >= 50) {
    return response.status(400).send("Nome deve ter no máximo 50 caracteres.");
  }

  if (password?.length >= 50) {
    return response.status(400).send("Senha deve ter no máximo 50 caracteres.");
  }

  const exists = await dataSource
    .getRepository("User")
    .findOne({ where: { email: email.toLowerCase() } });

  if (exists) {
    return response
      .status(400)
      .send("Já existe um usuário cadastrado com esse email!");
  }

  const user = await dataSource
    .getRepository("User")
    .create({ email: email.toLowerCase(), name, phone, password });
  const results = await dataSource.getRepository("User").save(user);

  return response.send(results);
}

async function UpdateUser(name, password, email, phone, response, dataSource) {
  const user = await dataSource
    .getRepository("User")
    .findOne({ where: { email: email.toLowerCase() } });

  if (!user) {
    return response.status(400).send("Usuário não encontrado!");
  }

  if (name) user.name = name;
  if (password) user.name = password;
  if (phone) user.name = phone;

  await dataSource.getRepository("User").update({ id: user.id }, user);

  return response.status(200).send();
}

async function ScheduleGet(dataSource) {
  return dataSource.getRepository("Schedule").find({ order: { time: "asc" } });
}

async function SchedulePost(name, time, service, response, dataSource) {
  const exists = await dataSource
    .getRepository("Schedule")
    .findOne({ where: { time: time } });

  if (exists) {
    return response
      .status(400)
      .send("Já existe agendamento nesse horário, escolha outro horário!");
  }

  const schedule = await dataSource
    .getRepository("Schedule")
    .create({ name, time, service });
  const results = await dataSource.getRepository("Schedule").save(schedule);

  return response.send(results);
}

module.exports = {
  Login,
  RegisterUser,
  UpdateUser,
  ScheduleGet,
  SchedulePost,
};
