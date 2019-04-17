import { Router } from 'express';
import { Group } from '../../db';
import { getRepository } from 'typeorm';
import { validate } from 'class-validator';
const router = Router();
router.get('/', (_, res) => res.render('groups/add'));
router.post('/', function(req, res) {
  const repository = getRepository(Group);
  const feedback = { errors: [] };

  if (1 > req.body.logo.length) {
    req.body.logo = undefined;
  }
  if ('true' == req.body.tokenExpires) {
    req.body.tokenExpires = new Date();
  }
  if (req.body.users) {
    if (!Array.isArray(req.body.users)) {
      req.body.users = [req.body.users];
    }

    req.body.users = req.body.users.map(id => ({ id: Number(id) }));
  }
  req.body.privilege = Number(req.body.privilege);
  req.body.token = Group.generateToken();
  const group = repository.create(<object>req.body);

  return validate(group, { skipMissingProperties: true })
    .then(errors => {
      if (errors.length) {
        feedback['errors'].push({ msg: 'Invalid data provided' });
        return {};
      }
      return repository.findOne({ slug: group.slug });
    })
    .then(isGroup => {
      if (isGroup) {
        feedback['errors'].push({ msg: 'Group already exists' });
        return undefined;
      }
      return repository.save(group);
    })
    .then(group =>
      group
        ? (feedback['success'] = 'Group was added')
        : (feedback['error'] = 'Group was not added')
    )
    .catch(e => console.log(e))
    .finally(() => res.render('groups/add', feedback));
});

module.exports = router;
