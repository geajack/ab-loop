export function instantiate(element, controllerClass)
{
    let controller = new controllerClass();

    for (let target of element.querySelectorAll("[click]"))
    {
        let handler = target.getAttribute("click");
        target.addEventListener("click", controller[handler].bind(controller));
    }

    for (let target of element.querySelectorAll("[bind]"))
    {
        let name = target.getAttribute("bind");
        let childControllerClass = target.getAttribute("controller");
        if (childControllerClass)
        {
            controller[name] = instantiate(target, eval(childControllerClass));
        }
        else
        {
            controller[name] = target;
        }
    }

    controller.initialize(element);

    return controller;
}